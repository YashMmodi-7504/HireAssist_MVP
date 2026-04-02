from pydantic import BaseModel
from typing import Optional, Dict, Any

class AIResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
