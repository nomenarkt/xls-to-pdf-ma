// Package context provides utilities for managing task logs and context operations.
package context

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

// BaseDir specifies the root directory where backlog.md and codex_task_tracker.md reside.
// Tests can override this to use a temporary directory.
var BaseDir = ""

const (
	backlogFile = "backend/backlog.md"
	taskLogFile = "codex_task_tracker.md"
)

// resolveBaseDir returns the directory containing backlog.md and codex_task_tracker.md.
// If BaseDir is set (tests), it is used as-is. Otherwise the function walks up
// from the current working directory until it finds the expected files.
func resolveBaseDir() string {
	if BaseDir != "" {
		return BaseDir
	}
	dir, err := os.Getwd()
	if err != nil {
		return ""
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, backlogFile)); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return ""
}

// UpdateTaskTracker updates an existing task status in codex_task_tracker.md or
// appends a new entry when not present. When parentTaskName is provided, the
// entry will be prefixed with "parent – task" unless already prefixed. The
// variadic argument keeps backward compatibility for existing callers.
func UpdateTaskTracker(taskName, layers, status, assignedTo, notes string, parentTaskName ...string) error {
	parent := ""
	if len(parentTaskName) > 0 {
		parent = parentTaskName[0]
	}
	if parent != "" && !strings.HasPrefix(taskName, parent+" – ") {
		taskName = fmt.Sprintf("%s – %s", parent, taskName)
	}

	base := resolveBaseDir()
	fp := filepath.Join(base, taskLogFile)

	if hasDuplicateTask(taskName) {
		data, err := os.ReadFile(fp)
		if err != nil {
			return fmt.Errorf("could not read codex_task_tracker.md: %w", err)
		}

		lines := strings.Split(string(data), "\n")
		for i, line := range lines {
			fields := strings.Split(line, "|")
			if len(fields) < 5 {
				continue
			}
			name := strings.TrimSpace(fields[1])
			if name == taskName {
				created := time.Now().Format("2006-01-02")
				if len(fields) >= 7 {
					created = strings.TrimSpace(fields[6])
				}
				updated := time.Now().Format("2006-01-02")
				lines[i] = fmt.Sprintf("| %-25s | %-25s | %-13s | %-11s | %s | %-10s | %-10s |",
					taskName, layers, status, assignedTo, notes, created, updated)
				break
			}
		}

		output := strings.Join(lines, "\n")
		if err := os.WriteFile(fp, []byte(output), 0644); err != nil {
			return fmt.Errorf("could not write to codex_task_tracker.md: %w", err)
		}
	} else {
		file, err := os.OpenFile(fp, os.O_APPEND|os.O_WRONLY, 0644)
		if err != nil {
			return fmt.Errorf("could not open codex_task_tracker.md: %w", err)
		}

		now := time.Now().Format("2006-01-02")
		row := fmt.Sprintf("| %-25s | %-25s | %-13s | %-11s | %s | %-10s | %-10s |\n",
			taskName, layers, status, assignedTo, notes, now, now)

		if _, err := file.WriteString(row); err != nil {
			_ = file.Close()
			return fmt.Errorf("could not write to codex_task_tracker.md: %w", err)
		}

		if err := file.Close(); err != nil {
			fmt.Fprintf(os.Stderr, "file.Close error: %v\n", err)
		}
	}

	if err := CleanBacklog(); err != nil {
		return fmt.Errorf("clean backlog: %w", err)
	}

	return nil
}

// AppendSubtask is a helper that prefixes the subtask with the parent task name
// and delegates to UpdateTaskTracker.
func AppendSubtask(parentTask, subtask, layers, status, assignedTo, notes string) error {
	return UpdateTaskTracker(subtask, layers, status, assignedTo, notes, parentTask)
}

func hasDuplicateTask(taskName string) bool {
	base := resolveBaseDir()
	fp := filepath.Join(base, taskLogFile)
	file, err := os.Open(fp)
	if err != nil {
		return false // Safe fallback
	}
	defer func() {
		if err := file.Close(); err != nil {
			fmt.Fprintf(os.Stderr, "file.Close error: %v\n", err)
		}
	}()

	scanner := bufio.NewScanner(file)
	rgx := regexp.MustCompile(`\|\s*(.*?)\s*\|`)

	for scanner.Scan() {
		line := scanner.Text()
		if rgx.MatchString(line) {
			task := rgx.FindStringSubmatch(line)[1]
			if task == taskName {
				return true
			}
		}
	}
	return false
}

// CleanBacklog removes tasks from /backend/backlog.md once they are marked
// `✅ Done` in codex_task_tracker.md. It preserves all other content and is
// safe to run multiple times.
func CleanBacklog() error {
	base := resolveBaseDir()
	done, err := parseDoneTasks()
	if err != nil {
		return err
	}

	// include variations of done task names without optional prefixes
	doneNormalized := make(map[string]struct{}, len(done))
	for name := range done {
		doneNormalized[name] = struct{}{}
		if strings.Contains(name, "–") {
			parts := strings.SplitN(name, "–", 2)
			trimmed := strings.TrimSpace(parts[0])
			if trimmed != "" {
				doneNormalized[trimmed] = struct{}{}
			}
		}
	}

	backlogPath := filepath.Join(base, backlogFile)
	backlogBytes, err := os.ReadFile(backlogPath)
	if err != nil {
		return fmt.Errorf("could not read backlog.md: %w", err)
	}

	lines := strings.Split(string(backlogBytes), "\n")
	var result []string
	var skip bool

	headingRgx := regexp.MustCompile(`(?i)^.*Codex Task:`)

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if headingRgx.MatchString(trimmed) && !strings.HasPrefix(trimmed, "<!--") && !strings.HasPrefix(trimmed, "*") && !strings.HasPrefix(trimmed, "-") && !strings.ContainsAny(trimmed, "\"'") {
			idx := strings.Index(strings.ToLower(trimmed), "codex task:")
			if idx != -1 {
				taskName := strings.TrimSpace(trimmed[idx+len("Codex Task:"):])
				taskName = strings.Trim(taskName, "[]")
				if _, ok := doneNormalized[taskName]; ok {
					skip = true
					continue
				}
				skip = false
			}
		}

		if skip {
			continue
		}
		result = append(result, line)
	}

	cleaned := strings.Join(result, "\n")
	if strings.HasSuffix(string(backlogBytes), "\n") && !strings.HasSuffix(cleaned, "\n") {
		cleaned += "\n"
	}

	if cleaned == string(backlogBytes) {
		return nil
	}

	if err := os.WriteFile(backlogPath, []byte(cleaned), 0644); err != nil {
		return fmt.Errorf("could not write backlog.md: %w", err)
	}
	return nil
}

func parseDoneTasks() (map[string]struct{}, error) {
	base := resolveBaseDir()
	fp := filepath.Join(base, taskLogFile)
	file, err := os.Open(fp)
	if err != nil {
		return nil, fmt.Errorf("could not open codex_task_tracker.md: %w", err)
	}
	defer func() {
		if err := file.Close(); err != nil {
			fmt.Fprintf(os.Stderr, "file.Close error: %v\n", err)
		}
	}()

	scanner := bufio.NewScanner(file)
	tasks := make(map[string]struct{})
	for scanner.Scan() {
		fields := strings.Split(scanner.Text(), "|")
		if len(fields) < 5 {
			continue
		}
		name := strings.TrimSpace(fields[1])
		status := strings.TrimSpace(fields[3])
		if status == "✅ Done" {
			tasks[name] = struct{}{}
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("scan codex_task_tracker.md: %w", err)
	}
	return tasks, nil
}

// 🧪 Example Usage:
// err := UpdateTaskTracker("Add nil forecast test", "context", "✅ Done", "Codex", "unit coverage", "Improve Forecast Coverage")
// if err != nil {
// 	log.Fatal(err)
// }
