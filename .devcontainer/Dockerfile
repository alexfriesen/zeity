FROM node:lts

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    nano \
    zsh \
    git \
    && \
    apt-get clean autoclean && \
    apt-get autoremove --yes && \
    rm -rf /var/lib/{apt,dpkg,cache,log}

ENV PNPM_HOME=/workspaces/pnpm
RUN corepack enable pnpm

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh
ENV EDITOR=nano
ENV VISUAL=nano
