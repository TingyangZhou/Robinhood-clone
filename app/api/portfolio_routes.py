from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3
from app.models import UserStock, Stock, db

portfolio_routes = Blueprint("portfolio", __name__)


# GET current user portfolio stocks
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
    

# POST a new stock to the current user's portfolio
@portfolio_routes.route('/<int:stockId>/current',methods=['POST'])
@login_required
def add_portfolio_stock(stockId):
    try:
        num_shares = request.json.get('num_shares')
        stock = Stock.query.get(stockId)
        if (stock):
            # step 1/2. try adding data to database
            updated_price = stock.updated_price
            user_id = current_user.get_id()
            new_user_stock = UserStock(
                user_id = user_id,
                stock_id = stockId,
                share_quantity = num_shares,
                share_price = updated_price
            )
            
            db.session.add(new_user_stock)
            db.session.commit()
            # step 2/2. construct response dictionary
            new_user_stock_dict = {
                "id": new_user_stock.id,  
                "ticker": stock.ticker,
                "company_name": stock.company_name,
                "image_url": stock.image_url,
                "company_info": stock.company_info,
                "updated_price": stock.updated_price,
                "Share_quantity": new_user_stock.share_quantity
            }
            response = make_response(jsonify(new_user_stock_dict),201)
            response.headers["Content-Type"] = "application/json"
            return response  
        else:
            #when the stock is not available in the stock universe
            response = make_response(jsonify({"message": "Stock couldn't be found"}), 404)
            response.headers["Content-Type"] = "application/json"
            return response
    except Exception as e :
        # in case the data has been push to database but ran into error in step 2 above, rollback the commit
        db.session.rollback()
        response_body = jsonify({ "message": str(e)})
        response = make_response(response_body,500)
        response.headers["Content-Type"] = "application/json"
        return response
    
    