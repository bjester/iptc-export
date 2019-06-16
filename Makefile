SHELL := /bin/bash

BUILDER = npx pkg --options no-warnings

build: | build-linux build-macos

build-%: index.js
	@PLATFORM="$(subst build-,,$@)"; \
	PLATFORM_DIR="./dist/$$PLATFORM"; \
	mkdir -p "$$PLATFORM_DIR"; \
	$(BUILDER) -t "$$PLATFORM" --out-path "$$PLATFORM_DIR" .; \
	zip -j "dist/iptc-export-$${PLATFORM}.zip" "$$PLATFORM_DIR/iptc-export"

clean:
	@$(RM) -rf dist

.PHONY: build build-%
