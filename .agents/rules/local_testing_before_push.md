# Validación Local Antes de Despliegues

## Contexto
Garantizar que todos los cambios implementados se verifiquen visual y funcionalmente en el navegador local antes de sincronizarlos con GitHub.

## Reglas Estrictas
1. **No ejecutes git push automáticamente.** Después de aplicar cualquier cambio en código, detente.
2. Inicia siempre el entorno de desarrollo local (ej. mediante 
pm run dev) usando una tarea en segundo plano.
3. Notifica al usuario que el servidor está levantado en localhost y solicita explícitamente su confirmación visual.
4. Única y exclusivamente cuando el usuario indique explícitamente que todo funciona y luce correctamente en su navegador, podrás proceder con los pasos de git add, git commit y git push.
