from fastapi import FastAPI

app = FastAPI(
    title="Cashless Casino API",
    description="API for the simulated casino experience using fake currency.",
    version="0.1.0"
)

@app.get('/')
def read_root():
    return {'Hello': 'World'}
