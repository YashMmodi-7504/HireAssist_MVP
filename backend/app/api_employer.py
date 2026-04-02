from fastapi import APIRouter, HTTPException

# Employer role removed from MVP. This router is retained as a harmless
# deprecated shim so calling code receives a clear error instead of 500s.
router = APIRouter(prefix="/api/employer", tags=["Deprecated"])


@router.get("/dashboard")
def employer_dashboard_removed():
    raise HTTPException(status_code=410, detail="Employer API removed in this MVP")
