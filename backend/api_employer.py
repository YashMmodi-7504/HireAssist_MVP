from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/employer", tags=["Deprecated"])


@router.get("/dashboard")
def employer_dashboard_removed():
    raise HTTPException(status_code=410, detail="Employer API removed in this MVP")
