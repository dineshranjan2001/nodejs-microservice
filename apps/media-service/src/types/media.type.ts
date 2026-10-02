export interface Attachments{
    id:string;
    task_id:string;
    image_url:string;
    public_id:string;
    uploaded_by:string;
    created_at:Date;
}

export interface AttachmentInput{
    taskId:string;
    imageUrl:string;
    publicId:string;
    uploadedBy:string;
}