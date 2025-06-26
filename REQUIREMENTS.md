# Especificación del Proyecto: Comment Hider Python

## Descripción general
Comment Hider Python es una extensión para Visual Studio Code que permite al usuario ocultar/mostrar visualmente los comentarios en archivos Python, ayudando a enfocarse únicamente en el código funcional. Los comentarios se mantienen en el archivo sin ser eliminados, pero se ocultan a nivel visual mediante decoraciones del editor.

## 🎯 Objetivo
Reducir el ruido visual en archivos .py permitiendo que el usuario oculte temporalmente los comentarios, mejorando la concentración y la legibilidad del código activo.

## Características clave
- Detecta y oculta comentarios de una sola línea (# comentario) en archivos Python.
- Detecta y oculta comentarios de multiples lineas ("""""" comentario) en archivos Python.
- Compatible con VSCode en TypeScript.
- Comando accesible vía paleta (Ctrl+Shift+P) para activar la ocultación.
- Conserva los comentarios en el archivo (solo visualmente ocultos).
- Fácil de extender a más lenguajes o tipos de comentarios en el futuro.

## 🔧 Requisitos funcionales
### Activación
La extensión se activa al ejecutar el comando Ocultar comentarios en Python.

### Desactivación
La extensión se activa al ejecutar el comando Mostrar comentarios en Python.

### Detección de comentarios
Detecta líneas que contienen comentarios de una sola línea, que comienzan con # o multilinea

### Decoración del editor
Aplica una decoración a las líneas de comentarios con:
- Opacidad: 0
- Tamaño de fuente: 0px

### Compatibilidad de lenguaje
Solo funciona en archivos con el lenguaje python.

## Requisitos técnicos
- Lenguaje: TypeScript
- Entorno de ejecución: Visual Studio Code
- APIs utilizadas: vscode.TextEditorDecorationType, vscode.commands, vscode.window
- Estructura del proyecto: Generada con yo code

## 📁 Estructura del proyecto

```bash
comment-hidder-python/
├── .vscode/
├── src/
│   └── extension.ts       ← Lógica principal
├── package.json           ← Declaración de comandos y configuración
├── tsconfig.json
├── README.md
└── ...otros archivos de VSCode extension
```

## 📜 Regex utilizada para encontrar comentarios:
/^(\s*)#.*$/gm, para comentarios de una linea
/("""[\s\S]*?"""|'''[\s\S]*?''')/g para comentarios multilinea

## 🧪 Casos de prueba (manuales)
| Escenario	| Resultado Esperado |
|----|-----|
| Archivo .py con comentarios | Comentarios desaparecen visualmente |
| Archivo sin comentarios | No ocurre nada |
| Archivo no Python (.js) | Se muestra advertencia y no hace nada |
| Ejecutar comando dos veces | Comentarios permanecen ocultos (de momento) |
| Comentarios inline (x = 1 # nota)	| (No se ocultan en esta versión básica) |

## 🔮 Posibles mejoras futuras
- Alternar visibilidad (mostrar/ocultar).
- Soporte para comentarios en línea (x = 1 # comentario).
- Compatibilidad con otros lenguajes.
- Configuración de opacidad y estilos desde settings.json.
- Comando automático al abrir archivos Python.