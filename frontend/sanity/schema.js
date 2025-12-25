import {blockContent} from './schemaTypes/blockContent'
import {category} from './schemaTypes/category'
import {post} from './schemaTypes/post'
import {author} from './schemaTypes/author'
import {table} from './schemaTypes/table'

export const schema = {
  types: [post, author, category, blockContent,table],
}
