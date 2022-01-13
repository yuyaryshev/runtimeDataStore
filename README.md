# runtimeDataStore

A minimalistic backend to store values at runtime.

# Installation

Copy settings_example.json to settings.json

Adjust it to your needs.

# Usage

## POST /:key

```json5
{
value: 'your value here',
ttl?: 300, // milliseconds to live
}
```

Can use `$$varPath$$` to substitute values, like this:

```json5
{
value: 'foo $$myVar.a.b.c$$ 123',
ttl?: 300, // milliseconds to live
}

// settings.json
{vars:{a:{b:{c:'baz'}}}}
```

will result in value `foo baz 123` 

## GET /:key

returns value stored in key

# Caution

If service is stopped for whatever reason all values are lost forever.
