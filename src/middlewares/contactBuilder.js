module.exports = (req,res,next) => {
    try{
        const {contact_phone, contact_owner, contact_email} = req.body;
        const contact = {};
        if(contact_phone) contact.phone = contact_phone;
        if(contact_owner) contact.owner = contact_owner;
        if(contact_email) contact.email = contact_email;
        req.body.contact = contact;
        next();
    } catch(err){
        next(err);
    }
};