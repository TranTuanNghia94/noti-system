.PHONY: get-secrets-windows get-secrets-unix

# Detect OS
ifeq ($(OS),Windows_NT)
    GET_SECRETS = get_secrets.bat
else
    GET_SECRETS = ./get_secrets.sh
endif

# Make the shell script executable
get_secrets.sh:
	chmod +x get_secrets.sh

# Target for Windows
get-secrets-windows:
	@if [ "$(OS)" = "Windows_NT" ]; then \
		$(GET_SECRETS); \
	else \
		echo "This target is for Windows only"; \
		exit 1; \
	fi

# Target for Unix-like systems (macOS and Linux)
get-secrets-unix: get_secrets.sh
	@if [ "$(OS)" != "Windows_NT" ]; then \
		$(GET_SECRETS); \
	else \
		echo "This target is for Unix-like systems only"; \
		exit 1; \
	fi

# Default target
get-secrets: get_secrets.sh
	@$(GET_SECRETS) 