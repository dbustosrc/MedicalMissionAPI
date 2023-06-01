const Period = require('../models/period');

class PeriodController {
  async createPeriod(req, res) {
    try {
      const { name, year, startDate, endDate } = req.body;
      const period = await Period.create({ name, year, startDate, endDate });
      res.status(201).json({ period });
    } catch (error) {
      res.status(500).json({ message: 'Error creating period', error });
    }
  }

  async updatePeriod(req, res) {
    try {
      const { id } = req.params;
      const { name, year, startDate, endDate } = req.body;
      const period = await Period.findByIdAndUpdate(
        id,
        { name, year, startDate, endDate },
        { new: true }
      );
      if (!period) {
        return res.status(404).json({ message: 'Period not found' });
      }
      res.json({ period });
    } catch (error) {
      res.status(500).json({ message: 'Error updating period', error });
    }
  }

  async deletePeriod(req, res) {
    try {
      const { id } = req.params;
      const period = await Period.findByIdAndDelete(id);
      if (!period) {
        return res.status(404).json({ message: 'Period not found' });
      }
      res.json({ message: 'Period deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting period', error });
    }
  }

  async getPeriod(req, res) {
    try {
      const { id } = req.params;
      const period = await Period.findById(id);
      if (!period) {
        return res.status(404).json({ message: 'Period not found' });
      }
      res.json({ period });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving period', error });
    }
  }

  async getPeriods(req, res) {
    try {
      const periods = await Period.find();
      res.json( periods );
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving periods', error });
    }
  }
}

module.exports = PeriodController;
