from .db import SCHEMA, add_prefix_for_prod, db, environment

class WatchlistStock(db.Model):
    __tablename__ = "watchlist_stocks"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete="CASCADE"), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id'), ondelete="CASCADE"), nullable=False)




    def to_dict_basic(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "stock_id": self.stock_id

        }

    def to_dict(self):
        return {
            
            "id": self.id,
            "ticker": self.stocks.to_dict_basic()['ticker'],
            "company_name": self.stocks.to_dict_basic()['company_name'],
            "image_url": self.stocks.to_dict_basic()['image_url'],
            "company_info": self.stocks.to_dict_basic()['company_info'],
            "updated_price": self.stocks.to_dict_basic()['updated_price']
        }


    
    