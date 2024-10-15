from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_swagger_ui import get_swaggerui_blueprint
from swagger.swagger_config import get_swagger_spec
from db import db

# Create the app factory
def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)



    # Register blueprints (API routes)
    from routes.users_route import users_bp
    from routes.event_route import event_bp
    from routes.sitting_interest_route import sitting_interest_bp
    from routes.sitting_request_route import sitting_request_bp
    from routes.adoption_interest_route import adoption_interest_bp
    from routes.adoption_route import adoption_bp
    from routes.event_interest_route import event_interest_bp

    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(event_bp, url_prefix='/events')
    app.register_blueprint(event_interest_bp, url_prefix='/event_interests')
    app.register_blueprint(sitting_interest_bp, url_prefix='/sitter_interests')
    app.register_blueprint(sitting_request_bp, url_prefix='/sitting_requests')
    app.register_blueprint(adoption_interest_bp, url_prefix='/adoption_interests')
    app.register_blueprint(adoption_bp, url_prefix='/adoption_listings')

    #API SWagger doc routes
    @app.route("/swagger.json")
    def swagger_json():
        return jsonify(get_swagger_spec())
    

    # Swagger UI setup
    SWAGGER_URL = '/docs'  # URL for exposing Swagger UI
    API_URL = '/swagger.json'  # URL for Swagger JSON specification
    swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={'app_name': "Pet Sitting & Adoption API"})
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
