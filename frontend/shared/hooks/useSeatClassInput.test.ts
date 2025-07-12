/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import { useSeatClassInput } from "./useSeatClassInput";

describe("useSeatClassInput", () => {
  test("valid change passes value", () => {
    const onValid = jest.fn();
    const { result } = renderHook(() => useSeatClassInput(0, onValid));
    act(() => {
      result.current.handleChange({ target: { value: "10" } } as any);
    });
    expect(onValid).toHaveBeenCalledWith(10);
    expect(result.current.error).toBe(false);
  });

  test("letters are blocked", () => {
    const onValid = jest.fn();
    const { result } = renderHook(() => useSeatClassInput(0, onValid));
    act(() => {
      result.current.handleChange({ target: { value: "abc" } } as any);
    });
    expect(onValid).not.toHaveBeenCalled();
    expect(result.current.value).toBe("0");
  });

  test("invalid numeric range sets error", () => {
    const onValid = jest.fn();
    const { result } = renderHook(() => useSeatClassInput(0, onValid));
    act(() => {
      result.current.handleChange({ target: { value: "100" } } as any);
    });
    expect(onValid).not.toHaveBeenCalled();
    expect(result.current.error).toBe(true);
  });
});
