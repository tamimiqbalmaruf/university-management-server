import { TCourse } from "./course.interface";
import { Course } from "./course.model"

const createCourse = async () => {
    const result = await Course.create();
    return result;
};

const getAllCourses = async () => {
    const result = await Course.find();
    return result;
}

const getSingleCourse = async (id: string) => {
    const result = await Course.findById(id);
    return result;
}

const updateCourse = async (id: string, payload: Partial<TCourse>) => {
    const result = await Course.findByIdAndUpdate(id, payload);
    return result;
}

const deleteCourse = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
}

export const CourseServices = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    deleteCourse
};