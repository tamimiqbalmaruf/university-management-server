import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { Course } from "./course.model"

const createCourse = async () => {
    const result = await Course.create();
    return result;
};

const getAllCourses = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'), query)
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await courseQuery.modelQuery;
    return result;
}

const getSingleCourse = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course');
    return result;
}

const updateCourse = async (id: string, payload: Partial<TCourse>) => {

    const { preRequisiteCourses, ...courseRemainingData } = payload;


    const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true });


    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
        const deletedPreRequisites = preRequisiteCourses.filter((item) => item.course && item.isDeleted).map(el => el.course);

        const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id, { $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } } })
    }


    return null;
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