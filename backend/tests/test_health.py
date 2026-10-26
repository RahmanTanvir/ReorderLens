from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_health_returns_exact_contract() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "reorderlens-api",
        "version": "mvp-1",
    }
