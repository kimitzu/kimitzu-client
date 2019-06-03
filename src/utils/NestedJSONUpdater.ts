/**
 * Utility function to access or write value to a nested JSON property.
 *
 * Current limitation: Property must exist on the original object.
 */
function NestedJSONUpdater(originalObject: object, path: string, value?: any) {
  const key = path.split('.')
  let reference = originalObject as any

  for (let index = 0; index < key.length - 1; index++) {
    const element = key[index]
    reference = reference[element]
  }

  reference[key[key.length - 1]] = value
  return originalObject
}

export default NestedJSONUpdater
