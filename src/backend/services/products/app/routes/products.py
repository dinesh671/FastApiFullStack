from fastapi import APIRouter
import json
from pathlib import Path
import random
from ..schemas.products import ProductBase,Rating

DATA_FILE = Path(__file__).parent.parent.parent / "data.json"
with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)
    
products_data = {item['id']: {k: v for k, v in item.items() if k != 'id'} for item in data}

# FIXED: Loop directly through the nested dictionaries inside your data map
for product in products_data.values():
    product["stock"] = random.randint(0, 100)
    product["isFeatured"] = random.choice([True, False])
    

router = APIRouter(prefix='/api/v1/products', tags=['Products'])
  # Debugging line to check the loaded data
@router.get("/")
async def get_products():
    return products_data


@router.get("/{product_id}")
async def get_product(product_id: int):
    if product_id in products_data.keys():
        return products_data[product_id]
    else:
        return {"message": f"Product {product_id} not found is either deleted or not available in the database."}

@router.post("/")
async def create_product(product: ProductBase):
    return {"message": "Product created", "product": product}

@router.post("/bulk")
async def create_products(products: list[ProductBase]):
    return {"message": "Products created", "products": products}

@router.put("/{product_id}")
async def update_product(product_id: int, product: ProductBase):
    if product_id in products_data.keys():
        products_data[product_id] = product
        return {"message":"product updated successfully"}
    else:
        return {"message": f"Product with product_id: {product_id} not found"}

# @router.patch("/{product_id}")
# async def review_product(product_id:int,rating:Rating):
#     if product_id in products_data.keys():
#         products_data[product_id]["rating"] = rating
#         same_rate = [p for p in products_data.values() if p["rating"].rate == rating.rate]
#         return {"message": f"you have reviewed with {rating.rate} stars and {same_rate}"}

@router.delete("/{product_id}")
async def delete_product(product_id: int):
    if product_id in products_data.keys():
        del products_data[product_id]
        return {"message": f"Product with product_id: {product_id} deleted"}
    else:
        return {"message": f"Product {product_id} not found is either please try after some time ."}
