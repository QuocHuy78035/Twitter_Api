export const numberEnumToArr = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value == 'number') as number[]
}
///this is for dev2