/**
 * Utility function to access or write value to a nested JSON property.
 *
 * Current limitation: Property must exist on the original object.
 */
function NestedJSONUpdater(originalObject: object, path: string, value?: any) {
  const key = path.split('.')
  let reference = originalObject as any

  let limit = 0

  if (value) {
    limit = 1
  } else {
    limit = 0
  }

  for (let index = 0; index < key.length - limit; index++) {
    const element = key[index]
    reference = reference[element]
  }

  if (value) {
    reference[key[key.length - 1]] = value
    return originalObject
  }

  return reference
}

export default NestedJSONUpdater
