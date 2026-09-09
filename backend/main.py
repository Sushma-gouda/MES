from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes.auth import router as auth_router
from routes.production_orders import router as production_orders_router
from routes.customers import router as customers_router
from routes.products import router as products_router
from routes.production_schedules import router as production_schedules_router
from routes.capacity_planning import router as capacity_planning_router
from routes.dispatch import router as dispatch_router
from routes.staging_kitting import router as staging_kitting_router

import models


Base.metadata.create_all(bind=engine)

app = FastAPI(title="MES Backend APIs")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(production_orders_router)
app.include_router(customers_router)
app.include_router(products_router)
app.include_router(production_schedules_router)
app.include_router(capacity_planning_router)
app.include_router(dispatch_router)
app.include_router(staging_kitting_router)

@app.get("/")
def root():
    return {
        "message": "MES Backend is running"
    }