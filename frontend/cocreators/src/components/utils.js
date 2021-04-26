import _ from 'lodash';


export function is_valid_url( url ){
    let url_object = null;
    try {
        url_object = new URL( url );
    } catch ( error ) {
        return false;
    }
    const protocol = url_object.protocol;
    const protocol_position = url.lastIndexOf( protocol );
    const domain_extension_position = url.lastIndexOf( '.' );
    return (
        protocol_position === 0 && [ 'http:', 'https:' ].indexOf( protocol ) !== - 1 && url.length - domain_extension_position > 2
    );

};







export function paginate(items,pageNumber,pageSize){
    const startIndex = (pageNumber - 1) * pageSize;
    return _(items).slice(startIndex).take(pageSize).value()
}