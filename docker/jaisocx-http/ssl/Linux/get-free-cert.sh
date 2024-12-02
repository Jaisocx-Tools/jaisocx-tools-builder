#!/bin/bash

# FREE HTTPS CERT BY CERTBOT, VALID FOR 90 DAYS

#=========== PLEASE SET HERE YOUR PARAMS ==============================
export EMAIL="illia.polianskyi@jaisocx.com"
export DOMAIN="politest.fun"

# Specify the keystore password 
# that is used to protect the integrity of the keystore.
# Keystore password must be at least 6 characters.

JKS_PASSWORD=adminpass

#===============================================================









###=============================================================
### DON'T EDIT BELOW
###=============================================================

sudo ufw allow 80

sudo apt update
sudo apt install snapd

sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

mkdir certs

export CERT_PATH="certs/$DOMAIN"

mkdir $CERT_PATH

certbot certonly \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  --domains $DOMAIN \
  --standalone \
  --preferred-challenges http-01 \
  --http-01-port 80
#  --cert-path $CERT_PATH

# Specify the target directory path.
TARGET_DIR=$CERT_PATH

### HERE GO PATHS TO YOUR CERT FILES FROM CERTIFICATION AUTHORITY
# Specify a .crt file path.
#CRT_FILE="${CERT_PATH}/fullchain.pem"
CRT_FILE="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"

# Specify a private key file path.
#PRIVATE_KEY="${CERT_PATH}/privkey.pem"
PRIVATE_KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

### HERE GO YOUR OUTPUT JKS PARAMS
# Keystore JKS alias.
JKS_ALIAS="${DOMAIN}"

# Specify the keystore file path.
JKS_FILE="${TARGET_DIR}/${DOMAIN}.jks"

# PKCS12 file path.
PKCS_FILE="$TARGET_DIR/keystore.p12"

# PKCS12 name.
PKCS12_NAME=$JKS_ALIAS

# PKCS12 password.
PKCS12_PASSWORD=p12temppass

# =================================================================================================
# Create PKCS12 keystore from certificate.
 openssl pkcs12 -export -name "$PKCS12_NAME" -in "$CRT_FILE" -inkey "$PRIVATE_KEY" \
 -passout pass:$PKCS12_PASSWORD -out "$PKCS_FILE"
# =================================================================================================

# Convert PKCS12 keystore into a JKS keystore.
keytool -importkeystore -destkeystore "$JKS_FILE" -srckeystore "$PKCS_FILE" -srcstoretype pkcs12 \
-srcstorepass $PKCS12_PASSWORD -alias $JKS_ALIAS -storepass $JKS_PASSWORD

# Delete temporary PKCS12 file
rm "$PKCS_FILE"
