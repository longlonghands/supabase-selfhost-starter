
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createFunction(
    { schema: 'public', name: 'before_insert' },
    [],
    {
      language: 'PLPGSQL',
      replace: true,
      behavior: 'STABLE',
      returns: 'TRIGGER',
    },
    `
  BEGIN
    NEW.created_at = now() AT time ZONE 'utc';
    NEW.updated_at = now() AT time ZONE 'utc';
    RETURN NEW;
  END;
  `
  )

  pgm.createFunction(
    { schema: 'public', name: 'before_update' },
    [],
    {
      language: 'PLPGSQL',
      replace: true,
      behavior: 'STABLE',
      returns: 'TRIGGER',
    },
    `
  BEGIN
    NEW.updated_at = now() AT time ZONE 'utc';
    RETURN NEW;
  END;
  `
  )

  pgm.createFunction(
    { schema: 'public', name: 'epochtime_in_milliseconds' },
    [],
    {
      language: 'PLPGSQL',
      replace: true,
      behavior: 'STABLE',
      returns: 'BIGINT',
    },
    `
  BEGIN
    RETURN floor(extract(EPOCH from NOW()) * 1000);
  END;
  `
  )

  pgm.createFunction(
    { schema: 'public', name: 'epochtime_in_seconds' },
    [],
    {
      language: 'PLPGSQL',
      replace: true,
      behavior: 'STABLE',
      returns: 'BIGINT',
    },
    `
  BEGIN
    RETURN floor(extract(EPOCH from NOW()));
  END;
  `
  )

  pgm.createFunction(
    { schema: 'public', name: 'nanoid' },
    [
      {
        name: 'size',
        type: 'integer',
        default: 12,
        mode: 'IN',
      },
    ],
    {
      language: 'plpgsql',
      replace: true,
      behavior: 'IMMUTABLE',
      returns: 'BIGINT',
    },
    `
  DECLARE
    alphabet text := '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    idBuilder     text := '';
    i             int  := 0;
    bytes         bytea;
    alphabetIndex int;
    mask          int;
    step          int;
  BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
      loop
        bytes := extensions.gen_random_bytes(size);
        while i < size
          loop
            alphabetIndex := (get_byte(bytes, i) & mask) + 1;
            if alphabetIndex <= length(alphabet) then
              idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
              if length(idBuilder) = size then
                return idBuilder;
              end if;
            end if;
            i = i + 1;
          end loop;

        i := 0;
      end loop;
  END;
  `
  )
}

export const down = false

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
