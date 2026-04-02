from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    """Simple health check for monitoring and load balancers.

    Returns a stable, deterministic payload as required by Phase 4.3.
    """
    return {"status": "ok", "service": "hireassist-api", "version": "1.0.0"}
