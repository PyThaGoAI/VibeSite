FROM node:20-alpine

# Install required dependencies
RUN apk add --no-cache git

# Clone repository
RUN git clone https://github.com/weise25/LocalSite-ai.git /app

# Set working directory
WORKDIR /app

# Install dependencies
RUN npm install

# Create script that generates the .env.local file at startup
RUN echo '#!/bin/sh' > /app/entrypoint.sh
RUN echo 'echo "# Configuration generated at startup" > .env.local' >> /app/entrypoint.sh
RUN echo 'echo "DEFAULT_PROVIDER=${DEFAULT_PROVIDER:-lm_studio}" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "# DeepSeek Configuration (Cloud AI models)" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "DEEPSEEK_API_BASE=${DEEPSEEK_API_BASE:-https://api.deepseek.com/v1}" >> .env.local' >> /app/entrypoint.sh
RUN echo 'if [ -n "$DEEPSEEK_API_KEY" ]; then echo "DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY" >> .env.local; fi' >> /app/entrypoint.sh
RUN echo 'echo "" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "# OpenAI Compatible Configuration (Cloud AI models)" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "OPENAI_COMPATIBLE_API_BASE=${OPENAI_COMPATIBLE_API_BASE:-https://api.openai.com/v1}" >> .env.local' >> /app/entrypoint.sh
RUN echo 'if [ -n "$OPENAI_COMPATIBLE_API_KEY" ]; then echo "OPENAI_COMPATIBLE_API_KEY=$OPENAI_COMPATIBLE_API_KEY" >> .env.local; fi' >> /app/entrypoint.sh
RUN echo 'echo "" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "# Ollama Configuration (Local AI models)" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "OLLAMA_API_BASE=http://host.docker.internal:11434" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "# LM Studio Configuration (Local AI models)" >> .env.local' >> /app/entrypoint.sh
RUN echo 'echo "LM_STUDIO_API_BASE=http://host.docker.internal:1234/v1" >> .env.local' >> /app/entrypoint.sh
RUN echo 'exec "$@"' >> /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]

# Start the application
CMD ["npm", "run", "dev"]