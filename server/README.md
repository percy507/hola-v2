### Build Steps

```bash
# now at server root folder

### start database server
# launched at http://localhost:27017/
mkdir -p .db && mongod --dbpath ./.db

### new terminal tab
# install dependency packs
npm install

# start app server
npm start
```
