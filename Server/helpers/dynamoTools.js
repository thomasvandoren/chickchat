import transform from "lodash/transform"

export function projectionExpression(fields) {
    var ExpressionAttributeNames = fields.reduce((obj, elm) => {
        obj["#" + elm[0] + elm[1]] = elm;
        return obj;
    }, {});
    return {
        ExpressionAttributeNames,
        ProjectionExpression: Object.keys(ExpressionAttributeNames).join(",")
    }
}

export function translateItemToJson(item) {
    return transform(item,
        (result, value, key) => {
            if (value.S) {
                result[key] = value.S
            } else {
                console.log('Failed to Deserialize - ' + key);
                console.log(value)
            }
        }, {})
}