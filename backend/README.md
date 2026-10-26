# ReorderLens AI — Backend API (`backend/`)

Stateless Python/FastAPI service for ReorderLens AI (DemandIQ Challenge MVP).

## Local Setup & Run

```powershell
# From repository root or backend/ directory:
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start development server on port 8000
python -m uvicorn app:app --reload --port 8000
```

## Run Automated Tests

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest -q
```
