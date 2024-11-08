from flask import Blueprint, jsonify
from flask_login import login_required, current_user

from app.models import User

user_routes = Blueprint("users", __name__)


@user_routes.route("/")
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route("/<int:id>")
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)

    if user:
        return user.to_dict()

    else:
        return {"error": "User Not Found"}, 404

@user_routes.route("/current")
def currUserInfo():
    user = User.query.get(current_user.id)

    return {
   "id": user.id,
   "username": user.username,
   "email": user.email,
   "cash_balance": user.cash_balance,
   "createdAt": "2021-11-19 20:39:36"
}
    

