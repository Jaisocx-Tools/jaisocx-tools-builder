FROM php:8.3-fpm

# Set environment variables for non-interactive installations
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install necessary dependencies and tools
RUN apt-get update

RUN apt-get -y install supervisor
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /etc/supervisor/conf.d

RUN apt-get install -y    libfreetype6-dev
RUN apt-get install -y    libjpeg62-turbo-dev
RUN apt-get install -y    libpng-dev
RUN apt-get install -y    libonig-dev
RUN apt-get install -y    libxml2-dev
RUN apt-get install -y    libssl-dev
RUN apt-get install -y    libcurl4-openssl-dev
RUN apt-get install -y    libzip-dev
RUN apt-get install -y    zip
RUN apt-get install -y    unzip
RUN apt-get install -y    git
RUN apt-get install -y    curl
RUN apt-get install -y    wget
RUN apt-get install -y    build-essential
RUN apt-get install -y    librabbitmq-dev
RUN apt-get install -y    libpq-dev
RUN apt-get install -y    default-mysql-client

# Install PHP extensions
RUN     docker-php-ext-configure gd --with-freetype --with-jpeg
RUN     docker-php-ext-install -j$(nproc) gd
RUN     docker-php-ext-install -j$(nproc) pdo 
RUN     docker-php-ext-install -j$(nproc) pdo_mysql 
RUN     docker-php-ext-install -j$(nproc) pdo_pgsql 
RUN     docker-php-ext-install -j$(nproc) mysqli 
RUN     docker-php-ext-install -j$(nproc) mbstring 
RUN     docker-php-ext-install -j$(nproc) zip 
RUN     docker-php-ext-install -j$(nproc) exif 
RUN     docker-php-ext-install -j$(nproc) pcntl 
RUN     docker-php-ext-install -j$(nproc) bcmath
RUN     pecl install amqp
RUN     docker-php-ext-enable amqp

# Clean up to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Set timezone
RUN ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && echo ${TIMEZONE} > /etc/timezone \
    && printf '[PHP]\ndate.timezone = "%s"\n', ${TIMEZONE} > /usr/local/etc/php/conf.d/tzone.ini \
    && "date"

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Xdebug
RUN pecl install xdebug
RUN docker-php-ext-enable xdebug

# Install Your custom php and xdebug config files
COPY ./conf/php/php.ini /usr/local/etc/php/php.ini 
COPY ./conf/php/conf.d/docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini 
COPY ./conf/php-fpm.d/www.conf /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/workspace/php

EXPOSE 9000

# Set the default command
CMD ["php-fpm"]

