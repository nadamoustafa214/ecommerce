 
 class ApiFeatures {
    constructor(mongooseQuery,queryData){
        this.mongooseQuery=mongooseQuery
        this.queryData=queryData
    }

    paginate(){
        let {page,size}=this.queryData
        if(!page ||page<=0){
            page=1
        }
        if(!size||size<=0){
            size=3
        }
        this.mongooseQuery.limit(parseInt(size)).skip((parseInt(page)-1)*parseInt(size))
        return this
    }

    filter(){
        const excludeQuersParams=['page','size','sort','search','fields']
        const filterQuery={...this.queryData}
        excludeQuersParams.forEach(params=>{
            delete filterQuery[params]
        })
        let queryStr = JSON.stringify(filterQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g, match => `$${match}`);
        return this
    }

    sort(){
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",",' '))
        return this
    }
    search() {
        if (this.queryData.search && typeof this.queryData.search === 'string') {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.queryData.search, $options: 'i' } },
                    { description: { $regex: this.queryData.search, $options: 'i' } }
                ]
            });
        }
        return this;
    }
    select(){
        this.mongooseQuery.sort(this.queryData.fields?.replaceAll(",",' '))
        return this
    }


 }

 export default ApiFeatures