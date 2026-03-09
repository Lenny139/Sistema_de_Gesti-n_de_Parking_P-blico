import FinderRepository from './FinderRepository.js'

export default interface Repository<E, T> extends FinderRepository<E, T> {
  save(item: T): Promise<T>
  update(id: E, item: Partial<T>): Promise<T | null>
  delete(id: E): Promise<boolean>
}
