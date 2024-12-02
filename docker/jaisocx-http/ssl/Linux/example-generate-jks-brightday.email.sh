# Specify the source directory path.
SRC_CATALOG="/Users/illiapolianskyi/Projects/jaisocx-http/ssl/Linux/brightday.email"
SRC_CERTS_CATALOG="${SRC_CATALOG}/STAR_brightday_email"

# Specify the target directory path.
TARGET_CATALOG="/Users/illiapolianskyi/Projects/jaisocx-http/ssl/Linux/brightday.email"


### HERE GO PATHS TO YOUR CERT FILES FROM CERTIFICATION AUTHORITY

# Specify a private key file path.
PRIVATE_KEY="${SRC_CATALOG}/brightday.email.key"

# Specify root CA.
ROOT_CA="${SRC_CERTS_CATALOG}/AAACertificateServices.crt"
CHAIN_CRT_1="${SRC_CERTS_CATALOG}/USERTrustRSAAAACA.crt"
CHAIN_CRT_2="${SRC_CERTS_CATALOG}/SectigoRSADomainValidationSecureServerCA.crt"
CHAIN_CRT_3="${SRC_CERTS_CATALOG}/STAR_brightday_email.crt"




### HERE GO YOUR OUTPUT JKS PARAMS
# Keystore JKS alias.
JKS_ALIAS="brightday.email"

# Specify the keystore password which is used to protect the integrity of the keystore.
# Keystore password must be at least 6 characters.
JKS_PASSWORD="JW5MYPKHbdqetvr4yfshiFwwjvr4fakE43qJUtgh7A2hNEW"

# Specify the keystore file path.
JKS_FILE="${TARGET_CATALOG}/brightday.email.jks"



###=============================================================
### DON'T EDIT BELOW
###=============================================================

# chain CA.
CHAIN_CA="${TARGET_CATALOG}/ca-chain.crt"

# PKCS12 file path.
PKCS_FILE="${TARGET_CATALOG}/keystore.p12"

# PKCS12 name.
PKCS12_NAME="${JKS_ALIAS}"

# PKCS12 password.
PKCS12_PASSWORD="p12temppass"

# =================================================================================================
# Create trusted CA chain of certificates. Create PKCS12 keystore from CA chain of certificates.
# cat "$SUB_CA" "$ROOT_CA" "$CRT_FILE" > "$CHAIN_CA"
 cat "${ROOT_CA}" "${CHAIN_CRT_1}" "${CHAIN_CRT_2}" "${CHAIN_CRT_3}" > "${CHAIN_CA}"
 openssl pkcs12 -export -name "${PKCS12_NAME}" -in "${CHAIN_CA}" -inkey "${PRIVATE_KEY}" \
 -passout pass:${PKCS12_PASSWORD} -out "${PKCS_FILE}"
# =================================================================================================

# Convert PKCS12 keystore into a JKS keystore.
keytool -importkeystore -destkeystore "${JKS_FILE}" -srckeystore "${PKCS_FILE}" -srcstoretype pkcs12 \
-srcstorepass "${PKCS12_PASSWORD}" -alias "${JKS_ALIAS}" -storepass "${JKS_PASSWORD}"

# Delete temporary PKCS12 file
rm "${PKCS_FILE}"

# Delete temporary CA chain file
rm "${CHAIN_CA}"

