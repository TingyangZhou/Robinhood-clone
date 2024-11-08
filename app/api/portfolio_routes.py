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
        return make_response(jsonify({"portfolio_stocks": current_user_stocks_dict}), 200, {"Content-Type": "application/json"})
    except Exception as e :
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})
    

# POST a new stock to the current user's portfolio
@portfolio_routes.route('/<int:stockId>/current',methods=['POST','PATCH','DELETE'])
@login_required
def handle_portfolio_stock(stockId):
    try:
        num_shares = request.json.get('num_shares')
        stock = Stock.query.get(stockId)
        user_id = current_user.get_id()
        if (stock):
            if (request.method =='POST'):
                # step 1/2 for POST. try adding data to database 
                updated_price = stock.updated_price
                new_user_stock = UserStock(
                    user_id = user_id,
                    stock_id = stockId,
                    share_quantity = num_shares,
                    share_price = updated_price
                )
                db.session.add(new_user_stock)
                db.session.commit()
                res_user_stock_id = new_user_stock.id
            elif request.method =='PATCH' or request.method =='DELETE':
                # step 1/2 for PATCH and DELETE. find the userstock record
                target_user_stock = UserStock.query.filter(UserStock.user_id==user_id, UserStock.stock_id==stockId).first()
                #when the stock is not owned by the current user ( not in the user_stocks table)
                if not target_user_stock:
                    return make_response(jsonify({"message": "Stock couldn't be found"}), 404, {"Content-Type": "application/json"})
                if request.method =='DELETE':
                    db.session.delete(target_user_stock)
                    db.session.commit()
                    return make_response(jsonify({"message": "successfully deleted"}), 202, {"Content-Type": "application/json"})
                elif request.method =='PATCH':
                    target_user_stock.share_quantity = num_shares
                    db.session.commit()
                    res_user_stock_id=target_user_stock.id
            # step 2/2 for POST & PATCH. construct response dictionary 
            new_user_stock_dict = {
                "id": res_user_stock_id,
                "ticker": stock.ticker,
                "company_name": stock.company_name,
                "image_url": stock.image_url,
                "company_info": stock.company_info,
                "updated_price": stock.updated_price,
                "Share_quantity": num_shares
            }
            return make_response(jsonify(new_user_stock_dict), 201, {"Content-Type": "application/json"})
        else:
            #when the stock is not available in the stock universe
            return make_response(jsonify({"message": "Stock couldn't be found"}), 404, {"Content-Type": "application/json"})
    except Exception as e :
        # in case the data has been push to database but ran into error in step 2 above, rollback the commit
        db.session.rollback()
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})
    
    
    