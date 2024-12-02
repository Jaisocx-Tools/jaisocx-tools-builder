FROM python:3

USER root

WORKDIR /var/www/workspace/py

# Install dependencies for pyenv and Python build
RUN apt-get update 

RUN apt-get install -y --no-install-recommends     build-essential 
RUN apt-get install -y --no-install-recommends     ca-certificates 
RUN apt-get install -y --no-install-recommends     curl 
RUN apt-get install -y --no-install-recommends     git 
RUN apt-get install -y --no-install-recommends     libbz2-dev 
RUN apt-get install -y --no-install-recommends     libffi-dev 
RUN apt-get install -y --no-install-recommends     liblzma-dev 
RUN apt-get install -y --no-install-recommends     libncurses5-dev 
RUN apt-get install -y --no-install-recommends     libncursesw5-dev 
RUN apt-get install -y --no-install-recommends     libreadline-dev 
RUN apt-get install -y --no-install-recommends     libsqlite3-dev 
RUN apt-get install -y --no-install-recommends     libssl-dev 
RUN apt-get install -y --no-install-recommends     llvm 
RUN apt-get install -y --no-install-recommends     python3-openssl 
RUN apt-get install -y --no-install-recommends     tk-dev 
RUN apt-get install -y --no-install-recommends     wget 
RUN apt-get install -y --no-install-recommends     xz-utils 
RUN apt-get install -y --no-install-recommends     zlib1g-dev 

RUN rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/workspace/py

# RUN pip install --upgrade uwsgi
# RUN pip install --upgrade Django

# Copy the requirements.txt file into the container
COPY ./conf/requirements.txt /var/www/workspace/py/requirements.txt

# Install the Python dependencies
RUN pip install -r /var/www/workspace/py/requirements.txt

# Copying uWSGI settings file to docker volume 

RUN mkdir -p /uwsgi
COPY ./conf/uwsgi.ini /uwsgi/uwsgi.ini

RUN chown -R www-data:www-data /var/www/workspace/py/
RUN chown -R www-data:www-data /uwsgi

RUN chmod -R a-rwx /var/www/workspace/py/
RUN chmod -R u+rwx /var/www/workspace/py/

RUN chmod -R a-wx /uwsgi
RUN chmod -R a+r /uwsgi
RUN chmod -R u+rwx /uwsgi



USER www-data

CMD ["uwsgi", "--ini", "/uwsgi/uwsgi.ini"]

EXPOSE 8000

# CMD ["bash", "-c", "tail -f < /dev/null"]

