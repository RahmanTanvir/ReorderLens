# 07 — Release-blocking defects, security and scientific integrity audit

```text
Perform a skeptical judge/security/ML audit of the EXISTING ReorderLens AI implementation, not a broad redesign. Read all docs/01...10, root AGENTS.md and docs/DEVELOPMENT_LOG.md. Inspect actual code/tests and routes. Confirm no fake computations, mock hardcoded API responses or decorative dead buttons. Verify Python ridge training and recursive validation have no future data leakage, the naive comparator uses same withheld 14 days, MAEs measured not guessed, the chosen model is actually the lower-MAE method, and metrics are called validation on synthetic data (when sample used). Verify negative/NaN/oversized/sparse input handling. Verify inventory arithmetic, API schema and consistent product selection. Check frontend transparency, keyboard navigation, responsive layout, error handling and refresh behavior.

Run real focused unit/integration tests and frontend type/build/lint. Review bundle/dependency risks, secrets, input size limits, sensitive data exposure, CORS and endpoint public exposure; do not claim production-grade privacy/authentication in stateless demo. Rank findings P0 critical / P1 important / P2 optional. Fix P0 blockers with minimal diffs and rerun relevant checks; propose any architectural deviation before changing it. Include actual file paths and test output. Record remaining limitations and false-claim risks. Update docs/DEVELOPMENT_LOG.md. Stop for human final demo approval; do not invent a passing audit.
```

## P0 fix order
(1) integrity/honesty → (2) API/backend → (3) calculations/ML → (4) data import → (5) browser flow → (6) deploy → (7) polish.
