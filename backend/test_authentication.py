import pytest
from app import app




@pytest.mark.parametrize("username, password, status_code", [
    ('philkeoghan', 'philstravels', 200),
    ('philkeoghan', 'Philstravels', 200),
    ('philkeoghan', 'Philstravels1', 200),
    ('philkeoghan', 'Philstravels1!', 200),
])
def test_login_route(username, password, status_code):
    client = app.test_client()
    response = client.post('/login', json={'username': username, 'password': password})
    assert response.status_code == status_code
