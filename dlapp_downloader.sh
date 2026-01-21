#!/usr/bin/env bash
set -e

echo "---- DEBUG START ----"

URL="$1"
# Fix desktop launcher quoting
URL="${URL%\"}"
URL="${URL#\"}"
echo "Full URL: $URL"

# Extract query string after '?'
QUERY="${URL#*\?}"
echo "Query string: $QUERY"

# URL decode function
urldecode() {
    local s="${1//+/ }"
    printf '%b' "${s//%/\\x}"
}

# Initialize
url_enc=""
name_enc=""
user_enc=""

# Extract parameters manually
for param in ${QUERY//&/ }; do
    key="${param%%=*}"
    val="${param#*=}"
    case "$key" in
        url) url_enc="$val" ;;
        name) name_enc="$val" ;;
        user) user_enc="$val" ;;
    esac
done

echo "Encoded URL: $url_enc"
echo "Encoded Name: $name_enc"
echo "Encoded User: $user_enc"

# Decode
url=$(urldecode "$url_enc")
name=$(urldecode "$name_enc")
user=$(urldecode "$user_enc")

echo "Decoded URL: $url"
echo "Decoded Name: $name"
echo "Decoded User: $user"

TARGET=""
echo "Target directory: $TARGET"

if [[ ! -d "$TARGET" ]]; then
    notify-send "Save to $user failed" "Output folder not found"
    exit 1
fi

OUT="$TARGET/$user/$name"

if [[ -e "$OUT" ]]; then
    notify-send "Save to $user failed" "File already exists: $name"
    exit 1
fi

curl -fL "$url" -o "$OUT"

notify-send -t 500 "Saved to $user" "$name"

echo "---- DEBUG END ----"

