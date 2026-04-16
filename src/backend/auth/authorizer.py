import json
import jwt  # Needs PyJWT
from urllib.request import urlopen

AUTH0_DOMAIN = 'your-tenant.auth0.com'
API_AUDIENCE = 'https://your-api-identifier'
ALGORITHMS = ["RS256"]

def handler(event, context):
    token = event.get('authorizationToken', '').replace('Bearer ', '')
    
    try:
        # 1. Get Auth0 Public Keys (JWKS)
        jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        
        # 2. Find the correct key
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"], "kid": key["kid"], "use": key["use"],
                    "n": key["n"], "e": key["e"]
                }
        
        # 3. Validate Token
        payload = jwt.decode(
            token, rsa_key, algorithms=ALGORITHMS,
            audience=API_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/"
        )
        effect = "Allow"
        principal_id = payload['sub']
    except Exception:
        effect = "Deny"
        principal_id = "user"

    return {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [{
                "Action": "execute-api:Invoke",
                "Effect": effect,
                "Resource": event['methodArn']
            }]
        }
    }
