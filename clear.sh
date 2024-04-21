#!/bin/bash

# Remover diretórios
rm -rf ./dist ./core ./utils

# Remover arquivos
rm -rf ./index.d.ts{,.map} ./index.js{,.map} ./types.d.ts{,.map} ./types.js{,.map} ./types-util.d.ts{,.map} ./types-util.js{,.map}
