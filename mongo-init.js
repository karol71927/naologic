db.createUser({
  user: 'nao',
  pwd: 'nao',
  roles: [
    {
      role: 'readWrite',
      db: 'naologic',
    },
  ],
});
