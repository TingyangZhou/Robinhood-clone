from flask import Blueprint, request
from flask_login import login_required

# from app.api.aws import get_unique_filename, upload_file_to_s3
# from app.forms import TweetForm
from app.models import Stock, db

portfolio_routes = Blueprint("portfolio", __name__)


@portfolio_routes.route("/")
@login_required
def stocks():
    return 