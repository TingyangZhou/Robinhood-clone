from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user


# from app.api.aws import get_unique_filename, upload_file_to_s3
# from app.forms import TweetForm
from app.models import Stock, db, WatchlistStock

watchlist_routes = Blueprint("watchlist", __name__)


@watchlist_routes.route("/current")
@login_required
def stocks():
    # Using filter with a condition
    watchlist = WatchlistStock.query.filter(WatchlistStock.user_id == current_user.id).all()
    watchlist_data = [item.to_dict() for item in watchlist]
    return jsonify({"watchlist_stocks": watchlist_data}), 200

