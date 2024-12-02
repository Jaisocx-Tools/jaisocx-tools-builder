# Specify the source directory path.
SRC_DIR="<path to your cert files and private key folder>"

# Specify the target directory path.
TARGET_DIR="<path to output jks file folder>"


### HERE GO PATHS TO YOUR CERT FILES FROM CERTIFICATION AUTHORITY
# Specify a .crt file path.
CRT_FILE="$SRC_DIR/<.crt file path>"

# Specify a private key file path.
PRIVATE_KEY="$SRC_DIR/<private key file path>"

# Specify root CA.
ROOT_CA="$SRC_DIR/<root ca .crt file path>"

# Specify sub CA.
SUB_CA="$SRC_DIR/<sub ca .crt file path>"



### HERE GO YOUR OUTPUT JKS PARAMS
# Keystore JKS alias.
JKS_ALIAS=<unique jks alias name>

# Specify the keystore password which is used to protect the integrity of the keystore.
# Keystore password must be at least 6 characters.
JKS_PASSWORD=<jks pass>

# Specify the keystore file path.
JKS_FILE="$TARGET_DIR/<jks file name>"



###=============================================================
### DON'T EDIT BELOW
###=============================================================

# chain CA.
CHAIN_CA="$TARGET_DIR/ca-chain.crt"

# PKCS12 file path.
PKCS_FILE="$TARGET_DIR/keystore.p12"

# PKCS12 name.
PKCS12_NAME=p12tempfile

# PKCS12 password.
PKCS12_PASSWORD=p12temppass

# =================================================================================================
# Create trusted CA chain of certificates. Create PKCS12 keystore from CA chain of certificates.
 cat "$SUB_CA" "$ROOT_CA" "$CRT_FILE" > "$CHAIN_CA"
 openssl pkcs12 -export -name "$PKCS12_NAME" -in "$CHAIN_CA" -inkey "$PRIVATE_KEY" \
 -passout pass:$PKCS12_PASSWORD -out "$PKCS_FILE"
# =================================================================================================

# Convert PKCS12 keystore into a JKS keystore.
keytool -importkeystore -destkeystore "$JKS_FILE" -srckeystore "$PKCS_FILE" -srcstoretype pkcs12 \
-srcstorepass $PKCS12_PASSWORD -alias $JKS_ALIAS -storepass $JKS_PASSWORD

# Delete temporary PKCS12 file
rm "$PKCS_FILE"

# Delete temporary CA chain file
rm "$CHAIN_CA"
