# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

---

### 1.9.0-beta - 2022-08-06

### Change

- Result: now you may return Result<void>

```ts

const result: Result<void> = Result.OK();

```
- Rename methods:

### Result:

- from `isFailure()` to `isFail()`
- from `isSuccess()` to `isOK()`
- from `isShortID()` to `isShort()`
- from `success()` to `OK()`
- from `createShort()` to `short()`

---
