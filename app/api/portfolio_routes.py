from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3
from app.models import UserStock, db

portfolio_routes = Blueprint("portfolio", __name__)

@portfolio_routes.route("/current", methods=['GET'])
# @login_required
def get_current_user_portfolio():
    try :
        current_user_stocks= UserStock.query.filter(UserStock.user_id==current_user.get_id()).all()
        current_user_stocks_dict = [
            {
                "id": user_stock.id,
                "user_id": user_stock.user_id,
                "stock_id": user_stock.stock_id,
                "share_quantity": user_stock.share_quantity,
                "share_price": user_stock.share_price
            }
            for user_stock in current_user_stocks
        ]
        response_body = jsonify({"portfolio_stocks": current_user_stocks_dict})
        response = make_response(response_body,200)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e :
        response_body = jsonify({ "message": str(e)})
        response = make_response(response_body,500)
        response.headers["Content-Type"] = "application/json"
        return response