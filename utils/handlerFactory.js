// Factory function for handling the creation of an item
exports.createOne = (Model) => async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    } catch (err) {
      next(err);
    }
  };
  
  // Factory function for handling getting a single item
  exports.getOne = (Model, populateOptions) => async (req, res, next) => {
    try {
      let query = Model.findById(req.params.id);
  
      if (populateOptions) {
        query = query.populate(populateOptions);
      }
  
      const doc = await query;
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    } catch (err) {
      next(err);
    }
  };
  
  // Factory function for handling updating an item
  exports.updateOne = (Model) => async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    } catch (err) {
      next(err);
    }
  };
  
  // Factory function for handling deleting an item
  exports.deleteOne = (Model) => async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  };
  